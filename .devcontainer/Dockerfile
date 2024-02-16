FROM mcr.microsoft.com/devcontainers/typescript-node:0-20
RUN apt-get update

# Install dependencies
RUN apt-get --no-install-recommends install -y \ 
  # Cypress dependencies: https://docs.cypress.io/guides/getting-started/installing-cypress#UbuntuDebian
  libgtk2.0-0 \ 
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  # clean up
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* 
