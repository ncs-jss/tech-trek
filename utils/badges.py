from django.apps import apps

def get_total_badges(player):
    badges_list = []
    Badge = apps.get_model('badges', 'Badge')
    for b in Badge.objects.all():
        badges_list.append(b.get_badge_count(player))
    return badges_list

def should_award_badge(player):
    # Badge = apps.get_model('badges', 'Badge')
    print("NUM QUES", player.num_questions_solved)
    if (player.num_questions_solved == 2):
        return True, "1"
    elif(player.num_questions_solved == 4):
        return True, "2"
    else:
        return False, None

# def award_badge(player, **kwargs):
#     should_award, badge = should_award_badge(player)
#     print("BADGE INFO", should_award, badge)
#     if should_award:
#         return badge.award_to(player)
#     return False
