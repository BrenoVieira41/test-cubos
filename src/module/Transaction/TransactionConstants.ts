const TYPE_ERROR_MESSAGE = 'Tipo de transferencia inválida, esperado entre crédito e débito.';
const DESCRIPTION_ERROR_MESSAGE = ', esperado entre 3 a 200 caracteres...';
const VALUE_ERROR_MESSAGE = 'Valor inválido, esperado um float.';
const ACCOUNT_ERROR_MESSAGE = 'Conta base inválida.';
const RECEIVER_ERROR_MESSAGE = 'Conta de recebimento inválida.';

const TRANSACTION_NOT_FOUND = 'Essa transação não e sua ou não existe.';

const INSUFFICIENT_BALANCE_MESSAGE = 'Não há saldo suficiente para realizar a transação.';
const INSUFFICIENT_REVERT_BALANCE_MESSAGE = 'Não há saldo suficiente para realizar o estorno, entre em contato com o suporte.';

const ONLY_INTERNAL_MESSAGE_ERROR = 'Não e possivel, estonar uma transação não interna.';
const REVERSAL_ALREADY_USED = 'Esse estorno já foi utilizado.';

export {
  TYPE_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  VALUE_ERROR_MESSAGE,
  ACCOUNT_ERROR_MESSAGE,
  RECEIVER_ERROR_MESSAGE,
  TRANSACTION_NOT_FOUND,
  INSUFFICIENT_BALANCE_MESSAGE,
  INSUFFICIENT_REVERT_BALANCE_MESSAGE,
  ONLY_INTERNAL_MESSAGE_ERROR,
  REVERSAL_ALREADY_USED
};
