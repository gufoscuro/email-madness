# Email Madness

Just a simpler way to update email templates

## How to run

```bash
# install dependencies
npm install

# build the app
npm run build

# run it
npm run preview
```

## General Layout
```html
<html>
  <head></head>
  <body>
    <div class="my-wrapper">
      
      {{main_template}}
      
    </div>
  <body>
</html>
```

## Page
```html
<div class="my-content">Hello World!</div>
```

## Result
```html
<html>
  <head></head>
  <body>
    <div class="my-wrapper">
      
      <div class="my-content">Hello World!</div>
      
    </div>
  <body>
</html>
```

## Templates Usage (in Page)
```html
<div class="my-content">

  {{template name(hello-world-text)}}
  
</div>
```
