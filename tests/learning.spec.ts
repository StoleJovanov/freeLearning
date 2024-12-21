import {test,expect} from '@playwright/test'

// Playwright-**Research, Learning, Discovery - Automated QA Testing(**From zero to hero)

//**The purpose for this document is that every new beginner automation test engineer can start and learn from basics to advanced automation testing using Playwright framework.**

//In our case we have playwright practice application and the tests are executed for those DOM elements.

//https://github.com/bondar-artem/pw-practice-app

//Above we can find the app which is used for practicing playwright
//1)Click on the link and download the app locally
//2)Execute //npm init playwright@latest --force  to download the latest version of playwright 
//(make sure you run your terminal in command prompt(cmd))
//-We chose TypeScript
//-Where do you want to keep your tests. select tests  folder

-//Add a GutHub actions workflow select false

//-Install playwright browser select Yes

//This is single test just to navigate to our app and click Forms—>Layouts so we can practice finding web elements with different locators

//Start the application:
//npm start

//Happy testing 😎

//**Interacting with web elements:**

//Import test method from playwright library:

test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.click('text=Form Layouts')
})

//Below are examples how we can find web elements with different locators:

test('Locator syntax rules', async({page}) => {
    //Locators are for the field name at email 
    //by Tag name
    page.locator('input')
    //by ID
    await page.locator('#inputEmail1').click()
    //by Class Value
    page.locator('.shape-rectangle')
    //by Attribute
    page.locator('[placeholder="Email"]')
    //by Class value(full value)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
    //combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle')
    //by Xpath
    page.locator('//*[@id=inputEmail1]') // not recoomanded
    //by Partial text match
    page.locator(':text("Using")')
    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

//1)User facing locators
//As we see the UI in the web page we can locate the elements by “User facing locators”

//User-Facing Locators
// https://playwright.dev/docs/best-practices
// https://playwright.dev/docs/locators#locate-by-role

 test('User-facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name:"Sign in"}).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').first().click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click() //We put the TestId in our source code ---> example:data-testid="SignIn" 
    await page.getByTitle('IoT Dashboard').click()
 })

//2)Locating Child/Parent elements

// Locating Child elements
test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    //nb-radio is a child element of nb card and it's written separately 
    //with :text-is("") -we search text in that specific element 
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button',{name: "Sign in"}).first().click()
    //.locator is regular locator , getByRole is UI(User Interface) locator
    await page.locator('nb-card').nth(3).getByRole('button').click //ke ja najde 4th card on the list// AVOID this method selcting by index
})

//Parent elements
test('locating parent elements',async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card',{has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).first().click()
    
    await page.locator('nb-card').filter({has: page.locator('checkbox')})
})

//Summarize
//In order to find a web element using a locator method you can use text filter or locator filter
// and then chain from this parent element,all the child elements that you want to select
//Also you can use filter method that do the exactly same thing
//What is the benefit of using the filter method is you can chain multiple filters one byu one narrowing down your output to the unique element untill 
//you get the desired result

//3)Reuse locators
//reuse locators
test('Reusing the locators', async({page}) =>{

    // await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox',{name:"Email"}).fill('stole@stole.com')
    // await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox',{name:"Password"}).fill('stole12345')
    // await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('button').click()  //we have repeating code so we use const method and just use reference to this locator
      const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
      const emailField =  await basicForm.getByRole('textbox', {name:"Email"})
      await emailField.fill('stole@stole.com')
      await basicForm.getByRole('textbox', {name:"Password"}).fill('stole12345')
      await basicForm.locator('nb-checkbox').click()
      await basicForm.getByRole('button').click() 
      await expect (emailField).toHaveValue('stole@stole.com') //in order to use expect(assertion) we need to import it from the playwright library(import {test} from '@playwright/test' vmetnuvame expect do test-vidi gore)

})

//Summarize 
//if you want to reduce the duplication of your code you can always reuse your locator assigning them to the constance


//4)Extracting different values from DOM element 

//Extract Different Values from DOM
test('Extractring values', async({page}) =>{
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')
    //If you want to grab a single text  from the web page for your web element you need to use
    //method textContent
    
    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1") //proveruva dali vo site tie vrednosti se sodrze Option 1
    //If you want to grab all text elements for the list of the web elements in this example radio buttons you need to use method allTextContents
    
    //Input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect (emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

    //If you want to get the property value of the input fields ex. is not a text you need to use method  inputValue
    //if you want to get value of any atributes on the web page use method getAttribute and as a argument provide the name of the attribute
    //and you will get the vallue of this particular attribute
})

//5)Assertions

//Assertions
test('assertions', async ({ page }) => {
  // Locate the "Basic form" button within the nb-card element
  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');
  
  // General assertions
  const value = 5;
  expect(value).toEqual(5); // Asserting a numeric value

  const text = await basicFormButton.textContent();
  expect(text?.trim()).toEqual("Submit"); 
  // Ensuring textContent is safely handled and whitespace is trimmed
  
  // Very simple, we just provide expect with the value we want to assert and the desired method with expectation
  // General assertions will not wait for any conditions; it simply performs the assertion when it's time to execute this particular line of code

  // Locator assertion
  await expect(basicFormButton).toHaveText('Submit');
  // Little bit smarter: Locator assertions interact with web elements, 
  // and their methods will wait up to 5 seconds for the element to be available to make an assertion

  // Soft assertion
  // We just need to add `soft`, and in this case, the test will not fail and continue to run even if the assertion has failed
  await expect.soft(basicFormButton).toHaveText('Submit');

  // Interact with the button
  await basicFormButton.click();
});

//UI components
//I will provide few examples of how should the flow looks with those components(Create new folder uiComponents.spec.ts


test.beforeEach(async({page}) => {
  await page.goto(' http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) 

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })
  })
//1)Checkboxes

//Checkboxes

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    //await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})  click command just click and does not validate the status
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})//check method will check the status of the checkbox, if the checbox is alreaddy checked it will not unselect the checkbox
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})
    const allBoxes =  await page.getByRole('checkbox')
    for (const box of await allBoxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy
    }
})

//To interact with checkboes better to use method check or uncheck, check or uncheck method will chek the status of the checkbox and if it is already selected
//it will not select this buttton agaim vice versa for uncheck

//2)Lists and dropdowns

//Lists and dropdowns

test('list and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select ')
    await dropDownMenu.click()

     page.getByRole('list') //list can be used when the list has UL tag  //list represent the parent container for the entiere list
     page.getByRole('listitem')//listitem can be use when the list has LI tag //listitem will  get you all list items from the list

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark","Cosmic","Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click() 
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')  //CSS Property is background-color

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        //at the end of our loop let's make our loop closed 
         if(color != "Corporate")
           await dropDownMenu.click()
    }    
})

//Tooltips

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card',{hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover

    page.getByRole('tooltip')//if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes',async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    page.on('dialog',dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText:"mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

//web tables
test('web tables',async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    //1 how to get the row byu any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowByID = page.getByRole('row', {name:'11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')
    
    //3 test filter of the table 

    const ages = ["20","30","40","200"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')
        for (let row of await ageRows.all()){
        const cellValue = await row.locator('td').last().textContent()

        if(age == "200") {
            expect(await page.getByRole('table').textContent()).toContain('No data found')
        } 
        else {
            expect(cellValue).toEqual(age) 
        }
        
        }
    }
})

//Sliders
test('Sliders', async ({ page }) => {
  // Updating the slider attribute
  const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  await tempGuage.evaluate(node => {
      node.setAttribute('cx', '232.630');
      node.setAttribute('cy', '232.630');
  });
  await tempGuage.click();

  // Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
  await tempBox.scrollIntoViewIfNeeded(); // Ensure the element is in view

  const box = await tempBox.boundingBox(); // Get the bounding box of the element
  if (!box) {
      throw new Error("Unable to get bounding box for tempBox. Ensure the element is visible.");
  }

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y); // Move mouse to the center of the element
  await page.mouse.down(); // Simulate mouse down event
  await page.mouse.move(x + 100, y); // Move horizontally
  await page.mouse.move(x + 100, y + 100); // Move diagonally
  await page.mouse.up(); // Simulate mouse up event

  await expect(tempBox).toContainText('30'); // Validate that the element contains the expected text
});


//**Page object model**(This is the part when it’s engineering time and will be updated when ready)