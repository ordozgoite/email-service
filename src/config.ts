import { z } from 'zod';

const kafkaSchema = z.object({
  brokersUrl: z.array(z.string()),
  clientId: z.string(),
  taskTopic: z.string(),
});

const emailSchema = z.object({
  userMail: z.string(),
  password: z.string(),
  targetMail: z.string(),
});


const configSchema = z.object({
  kafka: kafkaSchema,
  email: emailSchema,
});

export type TConfiguration = z.infer<typeof configSchema>;
export type TKafkaConfig = z.infer<typeof kafkaSchema>;
export type TEmailConfig = z.infer<typeof emailSchema>;
export default (): TConfiguration => {
  const brokersUrl = process.env.KAFKA_BROKERS_URL?.split(',');
  const config = {
    kafka: {
      brokersUrl: brokersUrl,
      clientId: process.env.KAFKA_CLIENT_ID,
      taskTopic: process.env.KAFKA_TASK_TOPIC
    },
    email: {
      userMail: process.env.MAIL_USER,
      password: process.env.MAIL_PASS,
      targetMail: process.env.MAIL_TO
    }
  };

  return configSchema.parse(config);
};