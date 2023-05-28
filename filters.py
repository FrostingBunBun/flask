from datetime import datetime

def format_datetime(value, format='%Y-%m-%d %H:%M:%S'):
    try:
        date_obj = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
        return date_obj.strftime(format)
    except ValueError:
        try:
            date_obj = datetime.strptime(value, '%Y-%m-%d')
            return date_obj.strftime('%Y-%m-%d')
        except ValueError:
            return ''

