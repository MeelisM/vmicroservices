Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "1024"
    vb.cpus = 2
    vb.customize ["modifyvm", :id, "--boot1", "disk"]
    vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
  end
  config.vm.boot_timeout = 1200
  config.vm.post_up_message = "VM started successfully! If you see errors, manually check VirtualBox."
end