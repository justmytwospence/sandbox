from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.gis.geos import GEOSGeometry, LineString, MultiLineString
from django.core.files.uploadedfile import UploadedFile
from .models import Course
import gpxpy

@csrf_exempt
def upload_gpx(request):
    if request.method == 'POST' and request.FILES.get('file'):
        gpx_file = request.FILES['file']
        gpx = gpxpy.parse(gpx_file.read().decode('utf-8'))
        line_strings = []
        for track in gpx.tracks:
            for segment in track.segments:
                points = [(point.longitude, point.latitude) for point in segment.points]
                line_string = LineString(points)
                line_strings.append(line_string)
        if line_strings:
            multi_line_string = MultiLineString(line_strings)
            Course.objects.create(name=gpx_file.name, geom=multi_line_string)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def get_courses(request):
    courses = Course.objects.all()
    features = []
    for course in courses:
        features.append({
            'type': 'Feature',
            'geometry': course.geom.json,  
            'properties': {
                'name': course.name
            }
        })
    return JsonResponse({'type': 'FeatureCollection', 'features': features})