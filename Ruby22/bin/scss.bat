@ECHO OFF
IF NOT "%~f0" == "~f0" GOTO :WinNT
@"D:\College Folder\UFOnline\CEN3031\ProjectGroupB\dev\mean\Ruby22\bin\ruby.exe" "D:/College Folder/UFOnline/CEN3031/ProjectGroupB/dev/mean/Ruby22/bin/scss" %1 %2 %3 %4 %5 %6 %7 %8 %9
GOTO :EOF
:WinNT
@"D:\College Folder\UFOnline\CEN3031\ProjectGroupB\dev\mean\Ruby22\bin\ruby.exe" "%~dpn0" %*
