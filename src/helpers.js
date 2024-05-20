/**
 * @param {String} date
 * @returns {Date}
 */
export function setMinTodoISODate(date) {
  return date.split(".").at(0);
}
