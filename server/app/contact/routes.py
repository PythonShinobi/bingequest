from flask import request, jsonify

from app.contact import bp
from app.contact.email import send_email

@bp.route('/contact', methods=['POST'])
def contact():
    try:
        # Extract data from the request
        data = request.json        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Send the email
        send_email(name, email, message)

        return jsonify({"message": "Email send successfully"}), 200
    except Exception as e:
        return jsonify({f'error: {str(e)}'}), 500