from flask import Flask, render_template_string, jsonify, request
import pandas as pd
from importance_level import importances
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
    importance: str
    estimated_end_time: str

#messege to the front
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'we are up!'})

@app.route('/get-dataframe', methods=['GET'])
def get_data_frame():
    df = pd.read_csv('tasks.csv', index_col= 'id')
    df_reset = df.reset_index()

    json_data = df_reset.to_dict(orient='records')
    # Return JSON data
    return jsonify(json_data)


#@app.route('/addtask', methods=['POST'])
#def add_task(task: Task):
    
   # df.add(task)
    
    #task_to_add = request.get_json()
    #return jsonify(task_to_add), 201
    

#@app.route('/deletetask', mathods=['POST'] )
#def delete_task(id_to_delete):

   # task_to_delete = request.

   #df = df.drop(df[df['id'] == id_to_delete].index)




@app.route('/')
def home():

    # Convert DataFrame to JSON
    #json_data = df.to_dict(orient='records')
    #return jsonify(json_data)
    
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