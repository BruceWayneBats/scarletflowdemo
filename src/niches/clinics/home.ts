/** Presentation copy used only by the main page, never by the demo or niche pages. */
export const home = {
  heading: ['Ни одна заявка', 'не останется', 'без ответа'],
  channels: 'Работает в Telegram, MAX и на вашем сайте',
  features: [
    { icon: 'bolt', title: 'Ответ за минуту', text: 'Пациент получает ответ сразу, даже в нерабочее время.' },
    { icon: 'calendar', title: 'Запись в расписание', text: 'Подбирает удобное время и записывает на приём.' },
    { icon: 'bars', title: 'Контроль обращений', text: 'Все заявки, записи и пропущенные звонки — в одном месте.' },
  ],
  steps: [
    { icon: 'chat', title: 'Пациент пишет в чат', text: 'В Telegram, MAX или на сайте.' },
    { icon: 'calendar', title: 'ИИ отвечает и предлагает время', text: 'Использует базу знаний вашей клиники.' },
    { icon: 'circleCheck', title: 'Записывает на приём', text: 'Создаёт запись в расписании и напоминает пациенту.' },
  ],
  question: 'Здравствуйте! Можно записаться завтра?',
  answer: 'Да, свободно в 12:30 и 16:00. Какое время вам подходит?',
  choice: 'На 12:30',
  confirmation: 'Готово! Вы записаны',
  when: 'Завтра, 12:30',
  specialist: 'Терапевт',
  reminder: 'Напомним вам за день до приёма.',
  statistics: [
    { icon: 'chat', title: 'Новые заявки', count: 12, tone: 'green' },
    { icon: 'calendar', title: 'Записи на приём', count: 8, tone: 'green' },
    { icon: 'phone', title: 'Пропущенные звонки', count: 3, tone: 'red' },
  ],
};
