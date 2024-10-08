from django.contrib.gis.db import models

class Course(models.Model):
    name = models.CharField(max_length=100)
    geom = models.GeometryField()

    def __str__(self):
        return self.name