import { LOWERCASE, NUMBERS, SYMBOLS, UPPERCASE } from './constants';
import { PasswordOptions } from './definitions';

const getRandomChar = (charset: string): string => {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex] || '';
};

const shufflePassword = (password: string): string => {
  // Convert the password string to an array, shuffle, and then join back into a string
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

const generatePassword = ({
  length,
  uppercase = true,
  lowercase = true,
  numbers,
  symbols,
}: PasswordOptions): string => {
  let charset = '';
  let password = '';

  if (uppercase) {
    charset += UPPERCASE;
    // make sure it contains at least 1 uppercase
    password += getRandomChar(UPPERCASE);
  }

  if (lowercase) {
    charset += LOWERCASE;
    // make sure it contains at least 1 lowercase
    password += getRandomChar(LOWERCASE);
  }

  if (numbers) {
    charset += NUMBERS;
    // make sure it contains at least 1 number
    password += getRandomChar(NUMBERS);
  }

  if (symbols) {
    charset += SYMBOLS;
    // make sure it contains at least 1 symbol
    password += getRandomChar(SYMBOLS);
  }

  // Fill the remaining length randomly from the combined charset
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charset);
  }

  // return a shuffled password to avoid having same pattern of initial chars
  // trim the password to the desired length
  return shufflePassword(password).slice(0, length);
};

export const strengthScore = (password: string): string => {
  let score = '';
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()-_=+[\]{}|;:,.<>?/]/.test(password);

  const passes = [hasUppercase, hasLowercase, hasNumber, hasSymbol];

  const falseCount = passes.filter(value => value === false).length;
  if (falseCount >= 2) {
    score = 'weak';
  } else if (falseCount === 1) {
    score = 'medium';
  } else {
    score = 'strong';
  }

  if (password.length < 8) {
    score = 'short';
  }

  return score;
};

export const optionsBoundary = (options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) => {
  const lowercase =
    !options.uppercase && !options.lowercase && !options.numbers && !options.symbols
      ? true
      : options.lowercase;
  return {
    ...options,
    lowercase,
  };
};

export default generatePassword;
