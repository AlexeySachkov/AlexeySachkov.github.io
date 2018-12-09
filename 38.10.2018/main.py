import urllib.request
import json
import datetime
import codecs
import time
import re

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


def next_date_timestamp(date):
    current = datetime.datetime.strptime(date.strftime("%d/%m/%Y"), "%d/%m/%Y")
    next = current + datetime.timedelta(days=1)
    return time.mktime(next.timetuple())


homeworks = [
    {
        'from': datetime.date(2018, 9, 24),
        'to': datetime.date(2018, 10, 14),
        'problems': ['4A', '116A', '231A', '467A']
    },
    {
        'from': datetime.date(2018, 10, 15),
        'to': datetime.date(2018, 11, 11),
        'problems': ['469A', '155A', '677A', '509A']
    },
    {
        'from': datetime.date(2018, 11, 19),
        'to': datetime.date(2018, 12, 9),
        'problems': ['460A', '379A', '705A', '492A']
    },
    {
        'from': datetime.date(2018, 12, 3),
        'to': datetime.date(2018, 12, 24),
        'problems': ['71A', '112A']
    }
]

HEADER = '<!DOCTYPE html><html>' \
         '<head><title>Отчёт о решении задач на codeforces</title>' \
         '<meta charset="UTF-8" />' \
         '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">' \
         '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>' \
         '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>' \
         '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>' \
         '<style type="text/css">' \
         'body { padding-top: 50px; }' \
         '</style>' \
         '</head><body>'

FOOTER = '<div class="container"><div class="row"><div class="col-md-12"><hr />' \
         '<p>Все вопросы, пожелания, найденные ошибки и неточности можно сообщить <a href="https://github.com/AlexeySachkov/AlexeySachkov.github.io/issues/new">создав issue</a>' \
         '<p>Generated by <a href="https://github.com/AlexeySachkov/AlexeySachkov.github.io/blob/master/38.10.2018/main.py">python script</a>. Big thanks <a href="https://codeforces.com/">Codeforces</a> for the <a href="http://codeforces.com/api/help">API</a>' \
         '<p>Powered by <a href="https://pages.github.com/">Github Pages</a> and <a href="https://getbootstrap.com/">Bootstrap</a>'\
         '</div></div></div></body></html>'

# Generate index page

with codecs.open('reports/index.html', 'w', "utf-8") as file:
    file.write(HEADER)
    file.write('<div class="container"><div class="row"><div class="col-md-12">')
    file.write('<h1>Отчёт о решении задач на codeforces</h1><hr />')
    file.write('<h2>Домашние задания</h2>')
    file.write('<div class="card-group">')
    index = 0
    for homework in homeworks:
        index = index + 1
        file.write('<div class="card"><div class="card-header">')
        file.write('Домашняя работа №{}</div>'.format(index))
        file.write('<ul class="list-group list-group-flush">')
        file.write('<li class="list-group-item">Задана: {}</li>'.format(homework['from'].strftime("%d.%m.%Y")))
        file.write('<li class="list-group-item">Сдать до: {}</li>'.format(homework['to'].strftime("%d.%m.%Y")))
        file.write('<li class="list-group-item">Список задач: ')

        total = len(homework['problems'])
        current = 0
        for problem in homework['problems']:
            current = current + 1
            matches = re.match(r'(\d+)([A-E]+)', problem)
            if matches is None:
                file.write(problem)
            else:
                file.write('<a href="https://codeforces.com/contest/{}/problem/{}" target="_blank">{}</a>'.format(matches[1], matches[2], problem))
            if current != total:
                file.write(', ')
        file.write('</li></ul></div>')

    file.write("</div>")
    file.write('<h2>Список индивидуальных отчётов</h2>')
    file.write('<ul>')
    for handle in handles:
        file.write('<li><a href="https://alexeysachkov.github.io/38.10.2018/reports/{}.html">{}</a></li>'.format(handle, handle))
    file.write('</ul>')
    file.write('</div></div></div>')
    file.write(FOOTER)

BASE_URL = 'http://codeforces.com/api/user.status'

for handle in handles:
    url = BASE_URL + '?lang=ru&handle={}&from=1&count=1000'.format(handle)
    print(url)
    content = urllib.request.urlopen(url).read()

    with codecs.open('reports/{}.html'.format(handle), 'w', "utf-8") as file:
        file.write(HEADER)
        file.write('<div class="container"><div class="row"><div class="col-md-12">')
        file.write('<h2 class="page-header">Отчёт о выполнении домашнего задания <a href="https://codeforces.com/prfile/{}">{}</a></h2><hr />'.format(handle, handle))
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
            file.write('<div class="card">')
            file.write('<div class="card-header">Домашняя работа №{}</div>'.format(index))
            file.write('<ul class="list-group list-group-flush">')
            file.write('<li class="list-group-item">Задана: {}</li>'.format(homework['from'].strftime("%d.%m.%Y")))
            file.write('<li class="list-group-item">Сдать до: {}</li>'.format(homework['to'].strftime("%d.%m.%Y")))
            file.write('</ul><div class="card-body">')

            end_timestamp = next_date_timestamp(homework['to'])

            num_in_time = 0
            num_late = 0
            for problem in homework['problems']:
                file.write('<h5 class="card-title">{}</h5>'.format(problem))
                if problem not in per_problem:
                    file.write('<p class="text-danger"><strong>Не было сделано ни одной попытки!</strong>')
                else:
                    got_ac = False
                    in_time = False
                    for submission in per_problem[problem]:
                        if submission['verdict'] == 'OK':
                            got_ac = True
                            if submission['creationTimeSeconds'] < end_timestamp:
                                in_time = True
                                break

                    file.write('<p>Было сделано попыток: {}. '.format(len(per_problem[problem])))
                    if got_ac and in_time:
                        num_in_time = num_in_time + 1
                        file.write('<strong class="text-success">Задача сдана вовремя</strong>')
                    elif got_ac:
                        num_late = num_late + 1
                        file.write('<strong class="text-warning">Задача не была сдана вовремя, однако был сдана позже</strong>')
                    else:
                        file.write('<strong class="text-danger">Задача не была сдана</strong>')
                    file.write('<p><a data-toggle="collapse" href="#{}-{}">Показать все попытки</>'.format(handle, problem))
                    file.write('<ul class="collapse" id="{}-{}">'.format(handle, problem))
                    for submission in per_problem[problem]:
                        file.write('<li><a href="https://codeforces.com/contest/{}/submission/{}">{}</a> - {}</li>'.format(submission['problem']['contestId'], submission['id'], submission['id'], submission['verdict']))
                    file.write('</ul>')

            file.write('</div><div class="card-footer">')
            total_done = num_in_time + num_late
            not_done = len(homework['problems']) - total_done
            score = 5 - not_done
            file.write('Всего решено задач: {}, вовремя: {}. Оценка: {}'.format(total_done, num_in_time, score))
            file.write('</div></div><br />')

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












