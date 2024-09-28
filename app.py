from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for flash messages

# Load and prepare data
def load_data():
    # Simulated data; replace with real data as needed
    return pd.DataFrame({
        'population_density': np.random.randint(100, 10000, 1000),
        'traffic_flow': np.random.randint(1000, 100000, 1000),
        'mileage': np.random.randint(0, 1000, 1000),  # Replacing city with mileage
        'ev_density': np.random.randint(0, 100, 1000),
        'optimal_location_score': np.random.randint(0, 100, 1000)
    })

# Train a RandomForest model
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Initialize the RandomForestRegressor model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    return model, scaler

# Load data and train model
data = load_data()
X = data[['population_density', 'traffic_flow', 'mileage', 'ev_density']]  # Updated to include mileage
y = data['optimal_location_score']
model, scaler = train_model(X, y)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/submit_support', methods=['POST'])
def submit_support():
    # Get data from the support form
    name = request.form['name']
    email = request.form['email']
    issue = request.form['issue']
    message = request.form['message']

    # Here, you would typically store the support request in a database
    # or send it to a support email. For now, let's just print it to the console.
    print(f'Support Request from {name}:')
    print(f'Email: {email}')
    print(f'Issue: {issue}')
    print(f'Message: {message}')

    # Flash a success message and redirect to the support page
    flash('Your support request has been submitted successfully. Our team will get back to you shortly.', 'success')
    return redirect(url_for('support'))

@app.route('/predict', methods=['POST'])
def predict():
    # Extracting features from the form
    features = [
        float(request.form['population_density']),
        float(request.form['traffic_flow']),
        float(request.form['mileage']),  # Replaced nearest_city with mileage
        float(request.form['ev_density'])
    ]
    
    # Scaling the features
    features_scaled = scaler.transform(np.array(features).reshape(1, -1))
    
    # Make the prediction using the trained model
    prediction = model.predict(features_scaled)[0]
    
    return jsonify({'prediction': round(prediction, 2)})

if __name__ == '__main__':
    app.run(debug=True)
