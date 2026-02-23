#!/bin/sh
# entrypoint.sh

# Path to template and output .env file
TEMPLATE_FILE=".env.template"
ENV_FILE=".env"

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Warning: $TEMPLATE_FILE not found. Skipping .env generation."
else
    echo "Generating $ENV_FILE from $TEMPLATE_FILE..."
    # Clear or create .env file
    > "$ENV_FILE"

    # Read template file line by line
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        case "$line" in
            ""|"#"*)
                echo "$line" >> "$ENV_FILE"
                continue
                ;;
        esac

        # Extract key and default value
        key=$(echo "$line" | cut -d'=' -f1)

        # Get value from environment
        eval "env_value=\${$key}"

        if [ -n "$env_value" ]; then
            # Use printf to safely handle values
            printf '%s="%s"\n' "$key" "$env_value" >> "$ENV_FILE"
        else
            echo "$line" >> "$ENV_FILE"
        fi
    done < "$TEMPLATE_FILE"
fi

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Launch the app
echo "Launching the app..."
exec "$@"
