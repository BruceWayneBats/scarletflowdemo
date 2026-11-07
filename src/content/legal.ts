/** Legal and contact data. Everything marked TODO must be filled in before launch. */
export const legal = {
  company: "TODO: юридическое лицо или ИП",
  inn: "TODO: ИНН",
  ogrn: "TODO: ОГРН / ОГРНИП",
  address: "TODO: юридический адрес",
  email: "TODO: e-mail для связи",
  phone: "TODO: телефон",
  telegram: "TODO: Telegram для связи",
  pdOperator: "TODO: оператор персональных данных (как в реестре Роскомнадзора)",
};

export const isTodo = (value: string) => value.startsWith("TODO");
