INSERT INTO `teachers` (`id`, `first_name`, `last_name`) 
VALUES (1, 'First', 'TEACHER');

INSERT INTO `teachers` (`id`, `first_name`, `last_name`) 
VALUES (2, 'Second', 'TEACHER');

INSERT INTO `teachers` (`id`, `first_name`, `last_name`) 
VALUES (3, 'Third', 'TEACHER');

INSERT INTO `users` (`id`, `admin`, `email`, `first_name`, `last_name`, `password`) 
VALUES (1, 1, 'admin@test.com', 'Admin', 'Test', '$2a$12$GWQ0zWMdiFQvJRBpr8VKfOoBCLcVTNTwbWucyDtU8fhP5MsIwiOMm');

INSERT INTO `users` (`id`, `admin`, `email`, `first_name`, `last_name`, `password`) 
VALUES (2, 0, 'user@test.com', 'User', 'Test', '$2a$12$BmezmuEMed1DlR5gtim3TO1s4y7bI9vMIHB0XagYSQhaBKeAsP36S');

INSERT INTO `sessions` (`id`, `date`, `description`, `name`, `teacher_id`) 
VALUES (1, '2026-04-15 10:00:00', 'Description de la session', 'Session Test', 1);

INSERT INTO `sessions` (`id`, `date`, `description`, `name`, `teacher_id`) 
VALUES (2, '2026-04-20 10:00:00', 'Description de la session', 'Session Test 2', 2);

INSERT INTO `participate` (`session_id`, `user_id`) 
VALUES (2, 1);