# plesynd

HTML5 Personal Learning Environment with Offline Capabilities

Entwickelt für Masterthesis: Entwicklung einer leichtgewichtigen "Personal Learning Environment" 
auf Basis aktueller Web-Technologien: https://github.com/rommsen/thesis

# Installation / Deployment von Plesynd

## Installation

Es wird davon ausgegangen, dass PHP (mindestens Version 5.3), ein
Webserver wie Apache, Mysql (mindestens Version 5.1), Java und Ant
bereits auf dem System, auf dem Plesynd installiert werden soll,
eingerichtet wurden.

### Wookie

Wookie muss wie in <http://wookie.apache.org/docs/source.html>
beschrieben installiert werden. Anschließend kann der Server mit
`ant run` im Wookie Verzeichnis gestartet werden. Standardmäßig hört
Wookie auf {http://localhost:8080/wookie}. Um einen anderen Virtual Host
zu benutzen muss die Datei `local.widgetserver.properties` angepasst und
direkt im Wookie Verzeichnis abgelegt werden (siehe
<http://wookie.apache.org/docs/developer/running.html>). Hier sollte ein
anderer Port gewählt werden als der auf den der Apache Server hört.

### Plesynd

Für die Installation von Plesynd müssen mehrere Schritte durchgeführt
werden:

1.  Composer installieren: <http://getcomposer.org/>

2.  Node.js installieren: `https://github.com/joyent/node/`\
     `wiki/Installing-Node.js-via-package-manager`

3.  Arbeitskopie aus github auschecken:\
     `git clone git@github.com:rommsen/plesynd.git`\
     {verzeichnis\_in\_dem\_plesynd\_installiert\_werden\_soll}

4.  Symfony2 installieren: `./composer install` im Verzeichnis der
    Arbeitskopie

5.  im Dialog die config Parameter setzen:

            database_driver:   pdo_mysql
            database_host:     localhost
            database_port:     ~
            database_name:     plesynd
            database_user:     [Datenbank-User]
            database_password: [Datenbank-Password]

            mailer_transport:  smtp
            mailer_host:       [Host fuer Mailversand]
            mailer_user:       [User fuer Mailversand]
            mailer_password:   [Password fuer Mailversand]
            mailer_encryption: null
            mailer_auth_mode:  plain
            mailer_port:       25
            delivery_address:  [Wenn gesetzt, gehen alle Mails an diese Adresse]

            locale:            en
            secret:            [Zufaelliger String, AENDERN]

            plesynd_protocol:  [z.B. http://] 
            plesynd_host:      [z.B. plesynd]

            wookie_protocol:   [z.B. http://
            wookie_host:       [z.B. 127.0.0.1
            wookie_port:       [z.B. 8080]
            wookie_path:       [z.B. wookie/]
            wookie_api_key:    [z.B. TEST, kann in Wookie hinterlegt werden]
            wookie_shared_data_key: [z.B. shared_data]
            wookie_login_name: [z.B. user]
         

    Die fertige Datei ist app/config/config.yml

6.  Virtual Host im Webserver anlegen und Document Root auf \
     {plesynd\_verzeichnis/web} setzen.

7.  Datenbank erstellen: `./app/console doctrine:database:create` im
    Verzeichnis der Arbeitskopie

8.  Datenbankschema erstellen: `./app/console doctrine:schema:create` im
    Verzeichnis der Arbeitskopie

9.  Wenn der Virtual Host auf z.B. auf http://plesynd hört, kann das
    System unter {http://plesynd/app.php} im Produktivmodus geöffnet
    werden. Für den Entwicklungsmodus kann {http://plesynd/app\_dev.php}
    aufgerufen werden.

### Todo-Widget

1.  Arbeitskopie aus github auschecken: \
     `git clone git@github.com:rommsen/plesynd-todo.git`\
     {verzeichnis\_in\_dem\_das\_widget\_hinterlegt\_werden\_soll}

2.  Pfad von `wookie.root.dir` in `build.xml` auf das
    Installationsverzeichnis von Wookie anpassen.

3.  Pfad von `widget.root.dir` in `build.xml` auf den aktuellen
    Widgetordner anpassen.

4.  {var base\_url} in der index.html anpassen

## Deployment

### Plesynd

Wenn bei den Konsolenkommandos der Parameter –env gesetzt wird, bestimmt
dies ob diese für die Entwicklungsgebung (`--env=dev`) oder die
Produktivumgebung (`--env=prod`) ausgeführt werden. In der
Entwicklungsgebung stehen zusätzliche Loggingmechanismen etc. zur
Verfügung.

1.  Leeren des Caches `./app/console cache:clear --env=prod|dev`

2.  Aufwärmen des Caches `./app/console cache:warmup --env=prod|dev`

3.  Dumpen der Assets (Javascript-, CSS-Dateien) in ein Verzeichnis, auf
    das der Webserver zugreifen kann
    `./app/console assetic:dump --env=prod|dev`. Zusätzlich kann der
    Parameter `--watch` übergeben werden, damit die Assets bei Änderung
    der Datei erneut gedumpt werden.

### Todo-Widget

1.  Nachdem Wookie über `ant run` gestartet wurde kann das Widget aus
    dem Widget-Verzeichnis heraus über
    `ant deploy-widget -Dwidget.shortname=todo` in der Wookie Instanz
    hinterlegt werden.

### Generieren der automatischen Docs

1.  installieren von phpdocumentor2 für PHP: <http://www.phpdoc.org/>

2.  installieren von yuidoc für Javascript:
    <http://yui.github.io/yuidoc/>

3.  für PHP: im Hauptverzeichnis von Plesynd: {phpdoc -d src/Coruja/ -t
    ../plesynd\_doc\_php} ausführen

4.  für Javascript: im Hauptverzeichnis von Plesynd: {yuidoc -o
    ../plesynd\_doc\_js src/Coruja/} ausführen


