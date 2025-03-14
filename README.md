# Estudio

Your last app for Spanish Learning

## Local deployment

This project is built with Next.js and Vercel AI SDK and utilizes the following services:

- **Supabase**: For database and backend services.
- **Upstash Redis**: For Redis database.
- **Vercel Blob**: For file storage.

You can configure and manage these services according to your needs.

### Prerequisites

Make sure you have Node.js and pnpm installed on your machine.

- **Node.js**: You can download and install Node.js from [https://nodejs.org/](https://nodejs.org/). It's recommended to use the LTS version.
- **pnpm**: After installing Node.js, you can install pnpm by running:

  ```bash
  npm install -g pnpm
  ```

### Installation

1. **Clone the repository**

   If you haven't already, clone the project repository to your local machine:

   ```bash
   git clone https://github.com/DanielDaniel2201/estudia
   cd spanish-chatbot
   ```

2. **Install dependencies**

   Navigate to the project directory in your terminal and install the required dependencies using pnpm:

   ```bash
   pnpm install
   ```

### Environment Variables

This project uses environment variables for configuration. You can find a `.env.example` file in the root of the project.

1. **Create a `.env.local` file**

   Copy the contents of `.env.example` to a new file named `.env.local` in the root directory of the project.

   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables**

   Open `.env.local` and fill in the necessary environment variables. Refer to `.env.example` and any project documentation for details on what each variable is used for and what values are required.

### Model Selection

To select a model and configure the API settings, you need to modify the environment variables in your `.env.local` file.
You can choose different models and their corresponding API settings based on your needs.
Please refer to the project documentation or `.env.example` for specific model options and required API configurations.
Model selection can be further configured within the `lib/ai/models.ts` file.

### Running the development server

Once the dependencies are installed and environment variables configured, you can start the development server:

```bash
pnpm dev
```

This command will start the Next.js development server. You can then access the application in your browser at `http://localhost:3000`.

The `pnpm dev` command will enable hot-reloading, so any changes you make to the code will be automatically reflected in the browser.

---

Now you should have the project running locally! If you encounter any issues, please open an issue in the repository.
