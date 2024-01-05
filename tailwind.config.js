/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    colors: {
      primary: '#F6BE00',
      white: '#F5F5F5',
      background: '#0D0E13',
      hover: '#F1C52E',
      active: '#CD9F03',
      shade1: '#16171C',
      shade2: '#1D1E25',
      shade3: '#2F313A',
      secondary: '#646464',
      secondary2: '#BBBBBB',
      tertiary: '#777777',
      danger: '#E73D49',
      danger_light: '#FE737D',
      invisible: 'rgba(255, 117, 127, 0.1)',
      green: '#5AE290',
    },
    extend: {
      fontSize: {
        title1: '24px', // 2xl
        title2: '20px', // xl
        title3: '17px', // lg
        button: '14px', // sm
        body_22_regular: '22px',
        body_16_regular: '16px', // base
        body_14_regular: '14px', // sm
        body_13_medium: '13px',
        body_13_regular: '13px',
        body_12_regular: '12px', // xs
        body_11_medium: '11px',
        body_11_regular: '11px',
        body_10_regular: '10px', // xxs

        xxs: '10px',
      },
      lineHeight: {
        title1: '28px',
        title2: '28px',
        title3: '24px',
        button: '20px',
        body_22_regular: '22px',
        body_16_regular: '20px',
        body_14_regular: '20px',
        body_13_medium: '20px',
        body_13_regular: '20px',
        body_12_regular: '16px',
        body_11_medium: '16px',
        body_11_regular: '16px',
        body_10_regular: '16px',

        xxs: '16px',
        xs: '16px',
        sm: '20px',
        base: '20px',
        lg: '24px',
        xl: '28px',
        '2xl': '28px',
      },
    },
    fontFamily: {
      regular: 'GolosText-Regular',
      medium: 'GolosText-Medium',
      demiBold: 'GolosText-DemiBold',
      bold: 'GolosText-Bold',
      black: 'GolosText-Black',

      body: 'GolosText-Regular',
    },
  },
  plugins: [],
};
