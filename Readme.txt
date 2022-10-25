бот для ведения семейного бюджета

// Готовые запросы к БД
Запрос расхода за неделю. (today-7days).
Запрос итога в разных валютах(хранится в долларах)


//записываю расход\доход, к нему пишет актуальное время.

INSERT INTO public.budget(
	id, "Rashod_Flat", "Rashod_Food", "Rashod_Taxi", "Rashod_Other", 
    "Salary", "Dohod_Flat", "Date", "Delta", "Result", "In_Fact")
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

SELECT id, "Rashod_Flat", "Rashod_Food", "Rashod_Taxi", "Rashod_Other", "Salary", "Dohod_Flat", "Date", "Delta", "Result", "In_Fact"
	FROM public.budget;

DELETE FROM public.budget
	WHERE "Rashod_Flat"=550;
