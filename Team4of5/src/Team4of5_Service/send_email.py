import smtplib

msg = 'You have been requested to sign up for Team4of5 by %s for company %s'

server = smtplib.SMTP('smtp.gmail.com',587) 
server.ehlo()
server.starttls()
server.ehlo()
server.login('team4of5.bu@gmail.com','team4of5csbu')
server.sendmail('team4of5.bu@gmail.com@gmail.com','araylw12@gmail.com@gmail.com',msg)
server.close()