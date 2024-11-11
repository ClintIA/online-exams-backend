export const formatPhoneNumber = (phoneNumber) => {
    let formattedNumber = phoneNumber.toString();

    formattedNumber = formattedNumber.replace(/\D/g, '');

    if (!formattedNumber.startsWith('55')) {
        formattedNumber = '55' + formattedNumber;
    }

    return formattedNumber;
};
