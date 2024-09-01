from flask import Flask, render_template_string, jsonify, request
import pandas as pd
from pydantic import BaseModel
from enum import Enum
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Importance(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Task(BaseModel):
    id: int
    name: str
    description: str
    is_done: bool
    importance: Importance
    estimated_end_time: str

def load_tasks():
    return pd.read_csv('tasks.csv', index_col='id')

def save_tasks(df):
    df.to_csv('tasks.csv')

@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    df = load_tasks()
    json_data = df.reset_index().to_dict(orient='records')
    return jsonify(json_data)

#messege to the front
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'we are up!'})

@app.route('/get-dataframe', methods=['GET'])
def get_data_frame():
    df = load_tasks()
    df_reset = df.reset_index()
    json_data = df_reset.to_dict(orient='records')
    return jsonify(json_data)

@app.route('/delete-task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    df = load_tasks()
    
    if task_id in df.index:
        df = df.drop(task_id)
        save_tasks(df)
        return jsonify({"message": f"Task {task_id} deleted successfully"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404


@app.route('/add-task', methods=['POST'])
def add_task():
    df = load_tasks()
    new_task = request.json
    
    # Create a new ID for the task
    new_id = df.index.max() + 1 if not df.empty else 1
    
    # Append the new task to the DataFrame
    df.loc[new_id] = [
        new_task['name'],
        new_task['description'],
        new_task['is_done'],
        new_task['importance'],
        new_task['estimated_end_time']
    ]
    
    save_tasks(df)
    
    return jsonify({"message": "Task added successfully", "id": new_id}), 201


@app.route('/')
def home():

    # Convert DataFrame to JSON
    #json_data = df.to_dict(orient='records')
    #return jsonify(json_data)
    df = load_tasks()
    # Convert DataFrame to HTML
    html_table = df.to_html(classes='table table-striped', index=False)
    # Render the HTML template
    return render_template_string('''
        <html>
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h1>my TODO list</h1>
                    {{ table | safe }}
                </div>
            </body>
        </html>
    ''', table=html_table)

if __name__ == '__main__':
    app.run(debug=True)