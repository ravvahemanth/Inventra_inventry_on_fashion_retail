# Multi-stage Docker build for Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/inventory-backend-1.0.0.jar app.jar
EXPOSE 8888
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8888}"]
