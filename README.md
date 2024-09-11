# node-wc-tool

wc tool written in node based on requirements from Coding Challenges

## How to run the project

First install dependencies. For npm run in terminal:

```
npm install
```

After installing dependencies the project needs to be compiled from TS to JS. In terminal run:
```
tsc
```

Now you can run the app.
There is a test file `test.txt` included in the repository that was used to follow Coding Challenges requirements.
An example of running the app with provided test file to see size of file in bytes using node js:
```
node dist/index.js -c test.txt
```

The app does support reading from standard input.
An example of using standard input instead of filename:
```
cat test.txt | node dist/index.js -l
```