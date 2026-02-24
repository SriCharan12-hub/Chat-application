export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getImageSrc = (profilePic) => {
    return profilePic;
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
export const NAME_REGEX = /^[a-zA-Z\s]+$/;
export const LOCATION_REGEX = /^[a-zA-Z\s,]+$/;
