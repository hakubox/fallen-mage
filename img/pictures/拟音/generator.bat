@echo off
:: 设置编码为UTF-8，解决中文文件名乱码问题
chcp 65001 >nul 2>&1

:: ====================== 可配置参数 ======================
:: 请修改这里为你的目标文件夹路径（路径有空格也可正常使用）
set "target_folder=%cd%"
:: 输出的txt文件名（默认在脚本同目录生成）
set "output_file=1.txt"

:: =======================================================

:: 清空输出文件（如果文件已存在，避免追加旧内容）
type nul > "%output_file%"

:: 遍历目标文件夹下的所有文件（仅当前目录，不包含子文件夹）
:: /b：仅显示文件名；/a-d：仅匹配文件（排除文件夹）
for /f "delims=" %%f  in ('dir /b /a-d "%target_folder%"') do (
    :: 将每个文件名逐行写入txt文件
    echo  %%~nf >> "%output_file%"
)

:: 执行完成提示
echo 文件名列表生成成功！
echo 目标文件夹：%target_folder%
echo 输出文件：%cd%\%output_file%
pause
