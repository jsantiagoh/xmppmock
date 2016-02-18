docker-build:
	docker build  -t xmppmock .

docker-run:
	docker run -it -p 6666:6666 -p 3000:3000 --rm --name xmppmock-1 xmppmock

run: docker-build docker-run

runrepo:
	docker run -it -p 6666:6666 -p 3000:3000 --rm --name xmppmock-1 jsantiagoh/xmppmock
