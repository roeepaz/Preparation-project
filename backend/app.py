from flask import Flask, render_template_string, jsonify, request
import pandas as pd
from base_task import Task
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)
df =pd.read_csv('tasks.csv', index_col='id')

def save_tasks(df):
    df.to_csv('tasks.csv')

@app.route('/get-dataframe', methods=['GET'])
def get_data_frame():
    df_reset = df.reset_index()
    json_data = df_reset.to_dict(orient='records')
    return jsonify(json_data)

@app.route('/delete-tasks', methods=['DELETE'])
def delete_tasks():
    global df
    task_id = request.json.get('id')
    if task_id in df.index:
        df.drop(index=[task_id],inplace=True)
        save_tasks(df)
        return jsonify({"message": f"Task {task_id} status updated successfully"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404


@app.route('/add-task', methods=['POST'])
def add_task():
    global df
    new_task = request.json
    print(new_task)
    
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
    print(df)
    save_tasks(df)
    
    return jsonify({"message": "Task added successfully", "id": f"new_id"}), 201

@app.route('/toggle-task-status', methods=['PUT'])
def toggle_task_status():
    global df
    task_id = request.json.get('id')

    if task_id in df.index:
        df.loc[task_id, 'is_done'] = True
        save_tasks(df)
        return jsonify({"message": f"Task {task_id} status updated successfully"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404

@app.route('/')
def home():
    # Convert DataFrame to JSON
    json_data = df.to_dict(orient='records')
    return jsonify(json_data)

if __name__ == '__main__':
# executor = ThreadPoolExecutor(max_workers=1)
    app.run(debug=True)

