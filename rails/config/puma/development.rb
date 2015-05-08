threads 8,32
workers 2
daemonize false
bind 'tcp://0.0.0.0:8000'
pidfile "/tmp/runverter-puma-development.pid"
state_path "/tmp/runverter-puma-development.state"
environment 'development'