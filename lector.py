from selenium import webdriver
import time




chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-notifications')
chrome_options.add_argument('--kiosk-printing')

# chrome_options.add_argument("--headless")
driver = webdriver.Chrome(executable_path="C:/Users/N001/Documents/Desarrollos/impresion-etiqueta-angular/archivosxd/chromedriver.exe",options=chrome_options)

# or you can use Chrome(executable_path="/usr/bin/chromedriver")
while True:
    var = input("Please enter something: ")
    print("Imprimiendo..."+var)
    # driver.execute_script("window.open('about:blank',"+var+");")
    # driver.switch_to.window(var)
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:4200/#/scanner?codigo="+var)
    # handle = driver.current_window_handle
    # driver.switch_to.window(handle)
    # driver.close()




# 0002850990060
# C:/Users/N001/Documents/Desarrollos/impresion-etiqueta-angular/archivosxd