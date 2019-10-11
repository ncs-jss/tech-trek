from django.db import models
from accounts.models import Player

from django.utils import timezone

BADGE_CHOICES = (
    ("1", "level1"),
    ("2", "level2"),
    ("3", "level3"),
    ("4", "solved first"),
)

class Badge(models.Model):
    description = models.CharField(max_length=255)
    badge_type = models.CharField(max_length=1, choices=BADGE_CHOICES)
    icon = models.ImageField(upload_to='img/badges')
    player = models.ManyToManyField(Player, related_name="badges", through="BadgeToPlayer")
    one_player_only = models.BooleanField(default=False)

    def __str__(self):
        return self.badge_type

    def get_badge_count(self, player):
        """
        Given a player object instace, returns total number of badges
        of this type that have been awarded to this player.
        """

        kwargs = {'badge': self}
        if player is None:
            pass
        if isinstance(player, Player):
            kwargs.update(dict(player=player))
        
        return BadgeToPlayer.objects.filter(**kwargs).count()

    def has_badge(self, player):
        return self in player.badges.all()
    
    def award_to(self, player):
        
        if self.has_badge(player):
            return False
        
        BadgeToPlayer.objects.create(badge=self, player=player)
        # TODO: Send signal when badge is awarded.
        return True

class BadgeToPlayer(models.Model):
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

    awarded_at = models.DateTimeField(default=timezone.now)
