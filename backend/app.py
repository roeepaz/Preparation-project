
from flask import Flask, render_template_string, jsonify

import pandas as pd


app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'we are up!'})


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
                    <h1>DataFrame Table</h1>
                    {{ table | safe }}
                </div>
            </body>
        </html>
    ''', table=html_table)

if __name__ == '__main__':
    app.run(debug=True)