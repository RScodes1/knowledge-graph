# Knowledge Graph Visualizer

## Running the Project Locally

Follow the steps below to run the project on your local machine.

### 1. Clone the Repository

```bash
git clone 
cd knowgraph
```

### 2. Install Dependencies

Make sure you have **Node.js (v18 or later)** installed.

Then install the project dependencies:

```bash
npm install
```

### 3. Start the Development Server

Run the development server:

```bash
npm run dev
```

### 4. Open the Application

Once the server starts, open your browser and go to:

```
http://localhost:3000
```

The Knowledge Graph application should now be running locally.

### Notes

* Graph data is initially loaded from the CSV files in the `public` directory.
* Any modifications made in the application are automatically saved in **localStorage**, so the graph state persists across page refreshes.
