import { NetworkEndpoints } from '@injectivelabs/networks';
import {
  ChainRestAuthApi,
  createTransactionWithSigners,
  getGasPriceBasedOnMessage,
  IndexerGrpcExplorerApi,
  MsgAuthzExec,
  PrivateKey,
  SignerDetails,
  TxRestApi,
} from '@injectivelabs/sdk-ts';
import { BigNumberInBase, getStdFee } from '@injectivelabs/utils';

import { wait } from '@tools/common';

export class TokenSignClient {
  chainId: string;
  endpoints: NetworkEndpoints;
  injectiveAddress: string;
  feePayer: string;
  feePayerSignerDetails: SignerDetails;
  feeRecipient: string;

  txEndpoint: string;
  txMemo: string;
  private privateKey: PrivateKey;

  constructor(
    chainId: string,
    endpoints: NetworkEndpoints,
    injectiveAddress: string,
    privateKey: string,
    feePayer: string,
    feePayerSignerDetails: SignerDetails,
    txEndpoint: string,
    txMemo: string
  ) {
    this.chainId = chainId;

    this.endpoints = endpoints;
    this.injectiveAddress = injectiveAddress;
    this.privateKey = PrivateKey.fromHex(privateKey);

    this.feePayer = feePayer;
    this.feePayerSignerDetails = feePayerSignerDetails;
    this.txEndpoint = txEndpoint;
    this.txMemo = txMemo;
  }

  async broadcastByToken(transactionMsgs) {
    const msgs = (Array.isArray(transactionMsgs) ? transactionMsgs : [transactionMsgs]) as any;

    /** Account Details * */
    const publicKey = this.privateKey.toPublicKey();
    const chainRestAuthApi = new ChainRestAuthApi(this.endpoints.rest);
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      this.privateKey.toAddress().bech32Address
    );
    const accountDetails = accountDetailsResponse.account.base_account;
    const timeoutHeight = new BigNumberInBase(999999999);

    const grantMsg = new MsgAuthzExec({
      grantee: this.privateKey.toAddress().bech32Address,
      msgs,
    });

    const gas = getGasPriceBasedOnMessage([grantMsg]).toString();

    /** Prepare the Transaction * */
    const { signBytes, txRaw } = createTransactionWithSigners({
      memo: this.txMemo,
      fee: {
        ...getStdFee(gas),
        payer: this.feePayer,
      },
      message: grantMsg,
      timeoutHeight: timeoutHeight.toNumber(),
      signers: [
        {
          pubKey: publicKey.toBase64(),
          accountNumber: Number(accountDetails.account_number),
          sequence: Number(accountDetails.sequence),
        },
        ...(this.feePayerSignerDetails ? [this.feePayerSignerDetails] : []),
      ],
      chainId: this.chainId,
    });

    /** Sign transaction */
    const signature = await this.privateKey.sign(Buffer.from(signBytes));

    /** Append Signatures */
    txRaw.signatures = [signature];

    /** Broadcast transaction */
    const txApi = new TxRestApi(this.txEndpoint);

    const txResponse = await txApi.broadcastBlock(txRaw);

    const explorerApi = new IndexerGrpcExplorerApi(this.endpoints.indexer);
    for (let i = 0; i < 10; i++) {
      try {
        const tx = await explorerApi.fetchTxByHash(txResponse.txHash);
        if (tx) {
          return tx;
        }
      } catch {}
      await wait(200);
    }
    return txResponse;
  }
}
