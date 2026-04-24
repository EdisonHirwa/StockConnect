# ==========================================
# STAGE 1: BUILD
# ==========================================
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# 1. Copy ONLY the Maven wrapper and pom.xml first
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# 2. Ensure Maven wrapper is executable (prevents "Permission denied" errors)
RUN chmod +x ./mvnw

# 3. Download all dependencies offline (Docker caches this step!)
RUN ./mvnw dependency:go-offline

# 4. Now copy the actual source code
COPY src ./src

# 5. Build the application using the cached dependencies
RUN ./mvnw clean package -DskipTests


# ==========================================
# STAGE 2: PRODUCTION RUN
# ==========================================
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# 1. Create a non-root user and group for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 2. Copy ONLY the compiled JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# 3. Start the application
# We use 'sh -c' so the shell properly evaluates Heroku's dynamic $PORT variable
CMD ["sh", "-c", "java -Xmx300m -Dserver.port=${PORT} -jar app.jar"]