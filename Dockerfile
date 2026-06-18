# Use official Python image
FROM python:3.11-slim

# Create a non-root user (required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY --chown=user requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy all project files to the container
COPY --chown=user . /app

# Hugging Face Spaces uses port 7860
EXPOSE 7860
ENV PORT=7860

# Start the application using Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860", "--timeout", "120"]
