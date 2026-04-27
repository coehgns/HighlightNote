FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the pre-built JAR from the host
COPY build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
