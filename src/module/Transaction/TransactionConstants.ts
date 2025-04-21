const TYPE_ERROR_MESSAGE = 'Tipo de transferência inválido. Esperado: crédito ou débito.';
const DESCRIPTION_ERROR_MESSAGE = ', esperado entre 3 a 200 caracteres...';
const VALUE_ERROR_MESSAGE = 'Valor inválido, esperado um float.';
const ACCOUNT_ERROR_MESSAGE = 'Conta base inválida.';
const RECEIVER_ERROR_MESSAGE = 'Conta de recebimento inválida.';
const TRANSACTION_ID_ERROR_MESSAGE = 'ID de transação inválido.';

const TRANSACTION_NOT_FOUND = 'Essa transação não é sua ou não existe.';
const TRANSFER_TO_SAME_ACCOUNT_ERROR =
  'Você não pode fazer uma transferência interna para a mesma conta.';
const INSUFFICIENT_BALANCE_MESSAGE = 'Não há saldo suficiente para realizar a transação.';
const INSUFFICIENT_REVERT_BALANCE_MESSAGE =
  'Não há saldo suficiente para realizar o estorno, entre em contato com o suporte.';

const ONLY_INTERNAL_MESSAGE_ERROR = 'Não e possivel, estonar uma transação não interna.';
const REVERSAL_ALREADY_USED = 'Esse estorno já foi utilizado.';

export {
  TYPE_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  VALUE_ERROR_MESSAGE,
  ACCOUNT_ERROR_MESSAGE,
  RECEIVER_ERROR_MESSAGE,
  TRANSACTION_ID_ERROR_MESSAGE,
  TRANSACTION_NOT_FOUND,
  TRANSFER_TO_SAME_ACCOUNT_ERROR,
  INSUFFICIENT_BALANCE_MESSAGE,
  INSUFFICIENT_REVERT_BALANCE_MESSAGE,
  ONLY_INTERNAL_MESSAGE_ERROR,
  REVERSAL_ALREADY_USED,
};
