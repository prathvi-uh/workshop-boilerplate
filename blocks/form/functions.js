/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
* Masks the first 5 digits of the mobile number with *
* @param {*} mobileNumber
* @returns {string} returns the mobile number with first 5 digits masked
*/
function maskMobileNumber(mobileNumber) {
  if (!mobileNumber) {
    return '';
  }
  const value = mobileNumber.toString();
  // Mask first 5 digits and keep the rest
  return ` ${'*'.repeat(5)}${value.substring(5)}`;
}

window.otpTimerInterval = window.otpTimerInterval || null;
window.otpWrongAttempts = typeof window.otpWrongAttempts === 'number' ? window.otpWrongAttempts : 3;

/**
 * Set field value safely
 * @param {scope} globals
 * @param {*} field
 * @param {string} value
 * @returns {string}
 */
function setFieldValue(globals, field, value) {
  if (!field) {
    return '';
  }

  try {
    field.value = value;
  } catch (e) {
    // ignore
  }

  try {
    globals.functions.setProperty(field, {
      value: value,
    });
  } catch (e) {
    // ignore
  }

  return '';
}

/**
 * Update attempts text
 * @param {scope} globals
 * @returns {string}
 */
function updateAttemptsDisplay(globals) {
  const attemptsField = globals.form.otp_verification.attempts_info;
  const label = window.otpWrongAttempts === 1 ? 'attempt left' : 'attempts left';

  setFieldValue(globals, attemptsField, `${window.otpWrongAttempts} ${label}`);
  return '';
}

/**
 * Initialize OTP state when OTP panel opens
 * @param {scope} globals
 * @returns {string}
 */
function initOtpState(globals) {
  const resendBtn = globals.form.otp_verification.resend_otp;
  const validateBtn = globals.form.otp_verification.validate_otp;
  const timerField = globals.form.otp_verification.timer;
  const messageField = globals.form.otp_verification.validation_message;

  window.otpWrongAttempts = 3;

  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  updateAttemptsDisplay(globals);
  setFieldValue(globals, messageField, '');
  setFieldValue(globals, timerField, '');

  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false,
    });
  }

  if (validateBtn) {
    globals.functions.setProperty(validateBtn, {
      enabled: true,
    });
  }

  return '';
}

/**
 * Start 30 sec timer
 * @param {scope} globals
 * @returns {string}
 */
function startOtpTimer(globals) {
  const timerField = globals.form.otp_verification.timer;
  const resendBtn = globals.form.otp_verification.resend_otp;

  let seconds = 30;

  if (!timerField) {
    return '';
  }

  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false,
    });
  }

  setFieldValue(globals, timerField, '00:30');

  window.otpTimerInterval = setInterval(() => {
    seconds -= 1;

    if (seconds >= 10) {
      setFieldValue(globals, timerField, `00:${seconds}`);
    } else if (seconds >= 0) {
      setFieldValue(globals, timerField, `00:0${seconds}`);
    }

    if (seconds <= 0) {
      clearInterval(window.otpTimerInterval);
      window.otpTimerInterval = null;

      setFieldValue(globals, timerField, '00:00');

      if (resendBtn) {
        globals.functions.setProperty(resendBtn, {
          visible: true,
          enabled: true,
        });
      }
    }
  }, 1000);

  return '';
}

/**
 * Stop timer
 * @param {scope} globals
 * @returns {string}
 */
function stopOtpTimer(globals) {
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  return '';
}

/**
 * Handle invalid OTP
 * @param {scope} globals
 * @returns {number}
 */
function handleInvalidOtp(globals) {
  const validateBtn = globals.form.otp_verification.validate_otp;
  const messageField = globals.form.otp_verification.validation_message;

  if (window.otpWrongAttempts > 0) {
    window.otpWrongAttempts -= 1;
  }

  updateAttemptsDisplay(globals);
  setFieldValue(globals, messageField, 'Invalid OTP');

  if (window.otpWrongAttempts === 0 && validateBtn) {
    globals.functions.setProperty(validateBtn, {
      enabled: false,
    });
  }

  return window.otpWrongAttempts;
}

/**
 * Handle valid OTP
 * @param {scope} globals
 * @returns {string}
 */
function handleValidOtp(globals) {
  const messageField = globals.form.otp_verification.validation_message;

  setFieldValue(globals, messageField, 'OTP validated successfully');
  stopOtpTimer(globals);

  return '';
}

/**
 * Resend OTP
 * @param {scope} globals
 * @returns {string}
 */
function handleResendOtp(globals) {
  const resendBtn = globals.form.otp_verification.resend_otp;
  const validateBtn = globals.form.otp_verification.validate_otp;
  const messageField = globals.form.otp_verification.validation_message;

  window.otpWrongAttempts = 3;

  updateAttemptsDisplay(globals);
  setFieldValue(globals, messageField, '');

  if (validateBtn) {
    globals.functions.setProperty(validateBtn, {
      enabled: true,
    });
  }

  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false,
    });
  }

  startOtpTimer(globals);

  return '';
}
// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber, startOtpTimer, stopOtpTimer, 
  debugForm,
};
