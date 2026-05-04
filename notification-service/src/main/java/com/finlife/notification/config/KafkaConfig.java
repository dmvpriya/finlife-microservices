package com.finlife.notification.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic budgetAlertTopic() {
        return TopicBuilder.name("budget-alerts")
                .partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic savingsGoalTopic() {
        return TopicBuilder.name("savings-goals")
                .partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic expenseAddedTopic() {
        return TopicBuilder.name("expense-added")
                .partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic investmentAlertTopic() {
        return TopicBuilder.name("investment-alerts")
                .partitions(1).replicas(1).build();
    }
}