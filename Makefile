build:
	docker-compose build

up:
	docker-compose up --build

down:
	docker-compose down

re: down up

up_with_clean: clean_all_with_db up

# Clean all containers and volumes, it's useful when you want to start from scratch
clean_all_with_db:
	docker-compose down -v
