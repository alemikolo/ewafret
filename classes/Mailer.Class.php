<?php

class Mailer {
    private $aValidateParams = [];
    private $aValidateParamsKeys = []; 
    private $aFormData = [];
    private $aMessage = [];
    private $aErrors = [];
    private $aFormKeys = []; 
    
    public function __construct(array $aValidateParams, array $aMessage) {
        $this->aFormKeys = array_keys(filter_input_array(INPUT_POST, FILTER_UNSAFE_RAW));
        $this->aValidateParams = $aValidateParams;
        $this->aMessage = $aMessage;
        $this->aValidateParamsKeys = array_keys($aValidateParams);
    }

    public function sendEmail() {  
        $this->ValidateForm($this->aValidateParamsKeys);     
        if(empty($this->aErrors)){           
            $this->mailSender();		
        }
        if(!empty($this->aErrors)){
            $aReturnedValuesAndErrors = [];
            foreach ($this->aFormData as $sKey => $sValue) {
                $aReturnedValuesAndErrors[$sKey]['value'] = $sValue;
            }
            foreach($this->aErrors as $sKey => $sValue) {
                $aReturnedValuesAndErrors[$sKey]['error'] = $sValue;
            }
            return $aReturnedValuesAndErrors;
        }
    }

    private function mailSender() {
        $this->prepareMessage();
        if($this->aFormData['sendemailcopy'] == 1){
            if(!mail($this->aMessage['recipients'], $this->aMessage['subject'], $this->aMessage['content'], $this->aMessage['header'])) {
                $this->aErrors['failed'] = $this->aMessage['error'];
            }
            else {            
                header("Location: dziekuje.html");
                exit();
            }
        }
        else {
             if(!mail($this->aMessage['recipient'], $this->aMessage['subject'], $this->aMessage['content'], $this->aMessage['header'])) {
                 $this->aErrors['failed'] = $this->aMessage['error'];
            }
            else{            
                header("Location: dziekuje.html");
                exit();
            }
        }       
        
    }

    private function prepareMessage(){
        $this->aMessage['recipients'] = $this->aMessage['recipient'].', '.$this->aFormData['email'];
        $this->aMessage['subject'] = $this->aFormData['subject'].$this->aMessage['subject'];        
        $this->aMessage['content'] = "Wiadomość od ".$this->aFormData['name']." ".$this->aFormData['surname']."\r\n".$this->aFormData['content'];
        $this->aMessage['header'] = "From: ".$this->aFormData['email']."\r\n".$this->aMessage['header'];       
        $this->aMessage['sender'] = $this->aFormData['email'];
    }
    
    private function ValidateForm($aKeys) {
        var_dump($_POST);
        foreach ($aKeys as $sKey) {
            if (array_key_exists($sKey, $this->aValidateParams)) {
                $this->FilterFormData($sKey);
            }
        }
    }

    private function FilterFormData($sKey) {
        if(trim(filter_input(INPUT_POST, $sKey, FILTER_UNSAFE_RAW)) !== '') {

            $this->aFormData[$sKey] = strip_tags(filter_input(INPUT_POST, $sKey, $this->aValidateParams[$sKey]['filter'], $this->aValidateParams[$sKey]['options']));
                
            if($this->aFormData[$sKey] === '') {
                $this->aFormData[$sKey] = filter_input(INPUT_POST, $sKey, FILTER_UNSAFE_RAW);
                $this->aErrors[$sKey] = $this->aValidateParams[$sKey]['error'];
            }
        }
       else if(key_exists('null', $this->aValidateParams[$sKey])) {
            $this->aErrors[$sKey] = $this->aValidateParams[$sKey]['null'];
        }
    }

    public function __destruct(){
        array_splice($_POST, 0);
    }
}
