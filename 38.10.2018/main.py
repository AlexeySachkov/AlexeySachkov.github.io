import urllib.request
import json
import datetime
import codecs
import time

handles = [
    'Natasha_andr',
    'imyanark',
    'andrushabausov',
    'MayeTusks',
    'matveykos',
    'artenator2',
    'Diana.kuptsova6062003',
    'VladimirLevin2002',
    'Ulia2911',
    'Wolf_from_Cintra',
    'olga_shakh',
    '3.x.310',
    'kristina_',
    'PRofe',
    'systemnickname',
    'VialovaA',
    'DanissimoKuw',
    'Dmitry_Ddv',
    'isashaaaa',
    'Mihail.M.K',
    'Ar1shka',
    'akon1te',
    'Sudarikov',
    'leyyyn'
]


def timestamp(date):
    return datetime.time.mktime(datetime.datetime.strptime(date, "%d/%m/%Y").timetuple())


homeworks = [
    {
        'from': datetime.date(2018, 9, 24),
        'to': datetime.date(2018, 10, 14),
        'problems': ['4A', '116A', '231A', '467A']
    }
]

HEADER = '<!DOCTYPE html><html>' \
         '<head><title>Отчёт о решении задач на codeforces</title>' \
         '<meta charset="UTF-8" />' \
         '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">' \
         '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>' \
         '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>' \
         '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>' \
        '</head><body>'

FOOTER = '</body></html>'

BASE_URL = 'http://codeforces.com/api/user.status'

for handle in handles:
    url = BASE_URL + '?lang=ru&handle={}&from=1&count=1000'.format(handle)
    print(url)
    content = urllib.request.urlopen(url).read()

    with codecs.open('reports/{}.html'.format(handle), 'w', "utf-8") as file:
        file.write(HEADER)
        file.write('<div class="container"><div class="row"><div class="col-md-12">')
        file.write('<h2 class="page-header">Submissions from {}</h2>'.format(handle))
        response = json.loads(content)

        if response['status'] != 'OK':
            file.write('<em>Failed to get data!</em>')
            continue

        per_problem = {}

        data = response['result']
        for submission in data:
            problem = str(submission['problem']['contestId']) + submission['problem']['index']
            if problem not in per_problem:
                per_problem[problem] = [submission]
            else:
                per_problem[problem].append(submission)

        index = 0
        for homework in homeworks:
            index = index + 1
            file.write('<h3>Домашняя работа №{}</h3>'.format(index))
            file.write('<p>Задана: {}<br />'.format(homework['from'].strftime("%d.%m.%Y")))
            file.write('Сдать до: {}'.format(homework['to'].strftime("%d.%m.%Y")))
            for problem in homework['problems']:
                file.write('<p class="lead"><em>{}</em>'.format(problem))
                if problem not in per_problem:
                    file.write('<p class="text-danger"><em>Не было сделано ни одной попытки!</em>')
                else:
                    got_ac = False
                    for submission in per_problem[problem]:
                        if submission['verdict'] == 'OK':
                            got_ac = True
                            break
                    file.write('<p>Было сделано попыток: {}. '.format(len(per_problem[problem])))
                    if got_ac:
                        file.write('<em class="text-success">Задача сдана</em>')
                    else:
                        file.write('<em class="text-warning">Задача не сдана</em>')
                    file.write('<p><a data-toggle="collapse" href="#{}-{}">Показать все попытки</>'.format(handle, problem))
                    file.write('<ul class="collapse" id="{}-{}">'.format(handle, problem))
                    for submission in per_problem[problem]:
                        file.write('<li><a href="https://codeforces.com/contest/{}/submission/{}">{}</a> - {}</li>'.format(submission['problem']['contestId'], submission['id'], submission['id'], submission['verdict']))
                    file.write('</ul>')

        #for problem, submissions in per_problem.items():
        #    title = submissions[0]['problem']['name']
        #    file.write('<h3>{}. {}</h3>'.format(problem, title))
        #    file.write('<ul>')
        #    for submission in submissions:
        #        file.write('<li>{} - {}</li>'.format(problem, submission['verdict']))
        #    file.write('</ul>')

        file.write('</div></div></div>')
        file.write(FOOTER)
        time.sleep(5)












