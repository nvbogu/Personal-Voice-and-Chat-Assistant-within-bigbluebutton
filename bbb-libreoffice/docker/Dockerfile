FROM openjdk:8-jre

ENV DEBIAN_FRONTEND noninteractive

RUN apt update

RUN apt -y install locales-all fontconfig libxt6 libxrender1 
RUN apt -y install libreoffice --no-install-recommends

RUN dpkg-reconfigure fontconfig && fc-cache -f -s -v

VOLUME ["/usr/share/fonts/"]
ADD ./bbb-libreoffice-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/bbb-libreoffice-entrypoint.sh" ] 
