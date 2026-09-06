/**
 * Process automatic loan generation if cash is insufficient to meet amount.
 * Returns updated { cash, loan, loanTaken }
 */
export const processDeficitLoan = (currentCash, currentLoan, amountNeeded) => {
  if (currentCash >= amountNeeded) {
    return {
      newCash: currentCash - amountNeeded,
      newLoan: currentLoan,
      loanTaken: 0,
    };
  }

  const deficit = amountNeeded - currentCash;
  return {
    newCash: 0,
    newLoan: currentLoan + deficit,
    loanTaken: deficit,
  };
};

/**
 * Process automatic loan repayment when receiving ₹1,500 Origin Bonus.
 * Returns { newCash, newLoan, amountRepaid, cashGranted }
 */
export const processOriginLoanRepayment = (currentCash, currentLoan, bonus = 1500) => {
  if (currentLoan <= 0) {
    return {
      newCash: currentCash + bonus,
      newLoan: 0,
      amountRepaid: 0,
      cashGranted: bonus,
    };
  }

  if (currentLoan >= bonus) {
    return {
      newCash: currentCash,
      newLoan: currentLoan - bonus,
      amountRepaid: bonus,
      cashGranted: 0,
    };
  }

  // Current loan is less than 1,500 bonus
  const cashGranted = bonus - currentLoan;
  return {
    newCash: currentCash + cashGranted,
    newLoan: 0,
    amountRepaid: currentLoan,
    cashGranted,
  };
};
