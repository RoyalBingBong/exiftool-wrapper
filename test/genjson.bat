@echo off
REM generate metadata jsons
forfiles /p testfiles /c "cmd /c exiftool -j -w! .@EXT.json \"@PATH\""
REM for /f %%f in ('dir /s/b derp') do (exiftool -j -w! json %%f)
REM move jsons
mkdir json
move testfiles\*.json json