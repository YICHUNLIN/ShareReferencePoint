# Kinman Share Point

由於金門縣的地理資訊平台不太好用，因此自己做一個小工具讓自己工作更方便XD，裡面的資料來自金門縣地理資訊系統(不過沒有同步)，因此不保證正確性。本專案不以營利為目的，純粹的研究座標系統並且自己練習使用。

> 為什麼有這個？

> 這也是不得已的，因為金門的二度分帶與本島的二度分帶不同，因此做個座標轉換小工具。

## API

## /kmgis


## GET /twd97towgs84?x={number}&y={number}

> return {x: number, y: number}

# GET /wgs84totwd97?lat={number}&lng={number}

> return {lat: number, lng: number}

# GET /twd97_nearby?x={number}&y={number}&scope={number}

> return {code: 200, count: number, data: [ array of point]}