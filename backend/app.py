from flask import Flask, render_template_string, jsonify
import pandas as pd
from importance_level import importances

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'we are up!'})

@app.route('/addtask')
def add_task():
    pass

@app.route('/deletetask')
def delete_task():
    pass


@app.route('/')
def show_dataframe():
    df = pd.read_csv('tasks.csv')
    
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